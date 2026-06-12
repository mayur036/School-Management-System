import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EMPTY_STATE, STAFF } from '@/lib/icons';

// Mock files list
const SCHOOL_FILES = [
  {
    name: 'Staff Handbook 2026.pdf',
    size: '2.4 MB',
    type: 'PDF Document',
    description: 'General policies, code of conduct, and employment terms.',
  },
  {
    name: 'Academic Calendar 2025-2026.pdf',
    size: '1.1 MB',
    type: 'PDF Document',
    description: 'School semesters, holidays, exam schedules, and events.',
  },
  {
    name: 'Expense Reimbursement Form.xlsx',
    size: '245 KB',
    type: 'Excel Spreadsheet',
    description: 'Template for filing school-related expenses and mileage.',
  },
  {
    name: 'Class Syllabus Template.docx',
    size: '98 KB',
    type: 'Word Document',
    description: 'Standardized layout for weekly subject syllabi.',
  },
];

// Mock payslips list
const PAYSLIPS = [
  { id: 1, month: 'May', year: 2026, base: 4500, tax: 450, net: 4050 },
  { id: 2, month: 'April', year: 2026, base: 4500, tax: 450, net: 4050 },
  { id: 3, month: 'March', year: 2026, base: 4500, tax: 450, net: 4050 },
  { id: 4, month: 'February', year: 2026, base: 4500, tax: 450, net: 4050 },
  { id: 5, month: 'January', year: 2026, base: 4500, tax: 450, net: 4050 },
];

export const DocumentsPage = () => {
  const handleDownload = (filename) => {
    toast.success(`Downloading ${filename}...`);
  };

  const handlePayslipDownload = (month, year) => {
    toast.success(`Simulating payslip download for ${month} ${year}...`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          Documents & Payslips
        </h1>
        <p className="text-muted-foreground text-sm">
          Access school resources, policies, and view your monthly salary
          details
        </p>
      </div>

      <Tabs defaultValue="resources" className="space-y-4">
        <TabsList className="bg-muted rounded-lg p-1">
          <TabsTrigger
            value="resources"
            className="rounded-md text-xs font-medium"
          >
            <STAFF.DOCUMENTS className="mr-2 h-3.5 w-3.5" />
            School Resources
          </TabsTrigger>
          <TabsTrigger
            value="payslips"
            className="rounded-md text-xs font-medium"
          >
            <STAFF.TIME_LOG className="mr-2 h-3.5 w-3.5" />
            My Payslips
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Policies & Forms */}
        <TabsContent value="resources" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {SCHOOL_FILES.map((file, idx) => (
              <Card
                key={idx}
                className="border-border bg-card hover:border-border/80 flex flex-col justify-between shadow-sm transition-colors"
              >
                <div>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle
                        className="text-foreground truncate text-sm font-semibold"
                        title={file.name}
                      >
                        {file.name}
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className="py-0.2 text-muted-foreground bg-muted border-none px-1.5 text-[9px] font-normal"
                      >
                        {file.size}
                      </Badge>
                    </div>
                    <CardDescription className="text-muted-foreground text-[10px] font-medium">
                      {file.type}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {file.description}
                    </p>
                  </CardContent>
                </div>
                <div className="border-border mt-2 flex justify-end border-t p-6 pt-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-border text-muted-foreground hover:text-foreground h-7 px-3 text-xs font-medium"
                    onClick={() => handleDownload(file.name)}
                  >
                    Download
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 2: Salary Payslips */}
        <TabsContent value="payslips" className="space-y-4">
          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="border-border border-b pb-3">
              <CardTitle className="text-foreground text-lg font-semibold">
                Salary Statements
              </CardTitle>
              <CardDescription>
                View monthly pay summaries and download statements
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {PAYSLIPS.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="text-muted-foreground text-xs font-semibold">
                          Period
                        </TableHead>
                        <TableHead className="text-muted-foreground text-xs font-semibold">
                          Base Salary
                        </TableHead>
                        <TableHead className="text-muted-foreground text-xs font-semibold">
                          Deductions / Tax
                        </TableHead>
                        <TableHead className="text-muted-foreground text-xs font-semibold">
                          Net Salary
                        </TableHead>
                        <TableHead className="text-muted-foreground text-right text-xs font-semibold">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {PAYSLIPS.map((slip) => (
                        <TableRow key={slip.id} className="hover:bg-muted/30">
                          <TableCell className="text-foreground text-xs font-semibold">
                            {slip.month} {slip.year}
                          </TableCell>
                          <TableCell className="text-muted-foreground font-mono text-xs">
                            ${slip.base.toLocaleString()}.00
                          </TableCell>
                          <TableCell className="font-mono text-xs text-rose-600 dark:text-rose-400">
                            -${slip.tax.toLocaleString()}.00
                          </TableCell>
                          <TableCell className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            ${slip.net.toLocaleString()}.00
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-border h-6 px-2.5 text-[10px]"
                              onClick={() =>
                                handlePayslipDownload(slip.month, slip.year)
                              }
                            >
                              Download PDF
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <EMPTY_STATE.NO_DATA className="text-muted-foreground/30 mb-2.5 h-10 w-10" />
                  <h3 className="text-foreground text-sm font-semibold">
                    No Payslips Released
                  </h3>
                  <p className="text-muted-foreground mt-0.5 max-w-65 text-xs">
                    Your salary statements will appear here once released by
                    accounts department.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentsPage;
