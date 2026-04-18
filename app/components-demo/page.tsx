"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { useModal } from "@/hooks/useModal";
import { Table } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { Search, Mail, Lock, User, Plus } from "lucide-react";

export default function ComponentsDemoPage() {
  const modal = useModal();
  const [tableSortDirection, setTableSortDirection] = useState<"asc" | "desc">("asc");

  const tableData = [
    { id: 1, name: "Kigali Heights", status: "Completed", date: "2022-01-15" },
    { id: 2, name: "Serene Valley", status: "Ongoing", date: "2024-05-10" },
    { id: 3, name: "Pearl Residences", status: "Planning", date: "2025-02-01" },
  ];

  const tableColumns = [
    { key: "id", header: "ID", sortable: true },
    { key: "name", header: "Project Name", sortable: true },
    { 
      key: "status", 
      header: "Status", 
      cell: (item: any) => (
        <Badge variant={item.status === 'Completed' ? 'default' : item.status === 'Ongoing' ? 'secondary' : 'outline'}>
          {item.status}
        </Badge>
      )
    },
    { key: "date", header: "Date" },
  ];

  return (
    <div className="container mx-auto px-4 py-24 max-w-5xl space-y-24 mt-10">
      
      <div>
        <h1 className="font-heading text-4xl font-bold mb-4">Design System &amp; Components UI</h1>
        <p className="text-neutral-500">A showcase of all reusable building blocks.</p>
      </div>

      {/* Buttons */}
      <section className="space-y-6">
        <h2 className="font-heading text-2xl font-bold border-b pb-2 text-neutral-900">1. Buttons</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button>Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="destructive">Destructive</Button>
          <Button isLoading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <Button size="sm">Small Size</Button>
          <Button size="default">Default Size</Button>
          <Button size="lg">Large Size</Button>
          <Button size="icon"><Plus className="w-5 h-5"/></Button>
        </div>
      </section>

      {/* Inputs */}
      <section className="space-y-6">
        <h2 className="font-heading text-2xl font-bold border-b pb-2 text-neutral-900">2. Universal Input</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Input label="Standard Text Input" placeholder="Type here..." />
          <Input label="Email Input with Icon" type="email" placeholder="john@example.com" icon={<Mail className="w-4 h-4" />} />
          <Input label="Password Input" type="password" placeholder="••••••••" icon={<Lock className="w-4 h-4" />} />
          <Input label="Input with Error" placeholder="Invalid input" error="This field is required." />
          <Input label="Textarea" type="textarea" placeholder="Type your message here..." />
          <div className="space-y-4">
            <Input label="Select Input" type="select" options={[
              { value: "architecture", label: "Architecture" },
              { value: "civil", label: "Civil Engineering" }
            ]} />
            <Input label="File Upload" type="file" />
            <div className="flex gap-4">
              <Input label="Subscribe to newsletter" type="checkbox" />
              <Input label="Accept terms" type="radio" />
            </div>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="space-y-6">
        <h2 className="font-heading text-2xl font-bold border-b pb-2 text-neutral-900">3. Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Simple Card</CardTitle>
              <CardDescription>Just header and body.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-600">This is a basic card component with simple text inside.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Card with Footer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-600">This card includes a footer area for actions.</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="ghost" size="sm">Cancel</Button>
              <Button size="sm">Save</Button>
            </CardFooter>
          </Card>
          <Card className="bg-primary text-white border-transparent">
            <CardHeader>
              <h3 className="font-heading text-xl font-bold">Colored Card</h3>
            </CardHeader>
            <CardContent>
              <p className="text-primary-100 text-sm opacity-90">Cards can easily be styled with tailored background colors and text variants.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Table */}
      <section className="space-y-6">
        <h2 className="font-heading text-2xl font-bold border-b pb-2 text-neutral-900">4. Data Table</h2>
        <Card>
          <div className="p-6">
            <Table 
              data={tableData} 
              columns={tableColumns} 
              searchable 
              sortKey="id"
              sortDirection={tableSortDirection}
              onSort={(key) => setTableSortDirection(prev => prev === "asc" ? "desc" : "asc")}
              pagination={{
                currentPage: 1,
                totalPages: 3,
                onPageChange: () => {}
              }}
            />
          </div>
        </Card>
      </section>

      {/* Modal */}
      <section className="space-y-6">
        <h2 className="font-heading text-2xl font-bold border-b pb-2 text-neutral-900">5. Modals & Dialogs</h2>
        <div>
          <Button onClick={modal.open}>Open Example Modal</Button>
          <Modal
            isOpen={modal.isOpen}
            onClose={modal.close}
            title="Create New Project"
            description="Enter the details for your new architectural project."
            footer={
              <>
                <Button variant="ghost" onClick={modal.close}>Cancel</Button>
                <Button onClick={modal.close}>Create Project</Button>
              </>
            }
          >
            <div className="space-y-4 py-4">
              <Input label="Project Name" placeholder="e.g. Kigali Tower" />
              <Input label="Budget" type="number" placeholder="$0.00" />
            </div>
          </Modal>
        </div>
      </section>

      {/* Loading Skeletons */}
      <section className="space-y-6 pb-24">
        <h2 className="font-heading text-2xl font-bold border-b pb-2 text-neutral-900">6. Loading Skeletons</h2>
        <div className="flex gap-4 items-start">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="space-y-2 flex-1 max-w-sm">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </section>

    </div>
  );
}
