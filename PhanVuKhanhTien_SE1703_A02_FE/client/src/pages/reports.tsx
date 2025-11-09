import React, { useState } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell 
} from '@heroui/table';
import { newsArticleService } from '../services/news-article.service';

export default function ReportsPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    setIsLoading(true);
    try {
      const data = await newsArticleService.getReport(startDate, endDate);
      setReportData(data);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">News Article Statistics Report</h1>

      {/* Date Range Filter */}
      <div className="flex gap-4 mb-6 items-end">
        <div>
          <label className="block mb-2 text-sm">Start Date</label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm">End Date</label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <Button color="primary" onPress={handleGenerateReport} isLoading={isLoading}>
          Generate Report
        </Button>
      </div>

      {/* Report Results */}
      {reportData && (
        <div className="space-y-6">
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">Summary</h2>
            <p>Period: {startDate} to {endDate}</p>
            <p className="text-2xl font-bold mt-2">
              Total Articles: {reportData.totalArticles || 0}
            </p>
          </div>

          {reportData.articles && reportData.articles.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Articles (Sorted by Date - Descending)</h2>
              <Table aria-label="Report articles">
                <TableHeader>
                  <TableColumn>Title</TableColumn>
                  <TableColumn>Category</TableColumn>
                  <TableColumn>Author</TableColumn>
                  <TableColumn>Created Date</TableColumn>
                  <TableColumn>Status</TableColumn>
                </TableHeader>
                <TableBody>
                  {reportData.articles.map((article: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{article.newsTitle}</TableCell>
                      <TableCell>{article.category?.categoryName || '-'}</TableCell>
                      <TableCell>{article.creator?.accountname || '-'}</TableCell>
                      <TableCell>{new Date(article.createdDate).toLocaleDateString()}</TableCell>
                      <TableCell>{article.newsStatus ? 'Active' : 'Inactive'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {reportData.byCategory && reportData.byCategory.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">By Category</h2>
              <Table aria-label="Report by category">
                <TableHeader>
                  <TableColumn>Category</TableColumn>
                  <TableColumn>Count</TableColumn>
                </TableHeader>
                <TableBody>
                  {reportData.byCategory.map((item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{item.categoryName}</TableCell>
                      <TableCell>{item.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {reportData.byStaff && reportData.byStaff.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">By Author</h2>
              <Table aria-label="Report by author">
                <TableHeader>
                  <TableColumn>Author</TableColumn>
                  <TableColumn>Count</TableColumn>
                </TableHeader>
                <TableBody>
                  {reportData.byStaff.map((item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{item.staffName}</TableCell>
                      <TableCell>{item.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}

      {reportData && reportData.articles && reportData.articles.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No articles found for the selected date range.
        </div>
      )}
    </div>
  );
}
