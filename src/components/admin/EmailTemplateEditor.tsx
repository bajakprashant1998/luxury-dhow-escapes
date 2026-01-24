import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmailTemplate, renderTemplate } from "@/hooks/useEmailTemplates";
import { Eye, Save, Code } from "lucide-react";

interface EmailTemplateEditorProps {
  templates: EmailTemplate[];
  onSave: (id: string, data: Partial<EmailTemplate>) => void;
  onToggle: (id: string, is_active: boolean) => void;
  isSaving?: boolean;
}

export default function EmailTemplateEditor({
  templates,
  onSave,
  onToggle,
  isSaving = false,
}: EmailTemplateEditorProps) {
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [editData, setEditData] = useState<Partial<EmailTemplate>>({});
  const [previewTab, setPreviewTab] = useState<"edit" | "preview">("edit");

  const selectedTemplate = templates.find((t) => t.template_key === selectedKey);

  useEffect(() => {
    if (templates.length > 0 && !selectedKey) {
      setSelectedKey(templates[0].template_key);
    }
  }, [templates, selectedKey]);

  useEffect(() => {
    if (selectedTemplate) {
      setEditData({
        subject: selectedTemplate.subject,
        body_html: selectedTemplate.body_html,
        body_text: selectedTemplate.body_text,
      });
    }
  }, [selectedTemplate]);

  const sampleVariables: Record<string, string> = {
    customer_name: "John Smith",
    tour_name: "Dubai Marina Dhow Cruise",
    booking_date: "January 25, 2026",
    total_price: "299.00",
    adults: "2",
    children: "1",
    email: "john@example.com",
    message: "I would like to know more about your yacht tours.",
    subject: "Tour Inquiry",
    site_name: "Luxury Dhow Escapes",
  };

  const handleSave = () => {
    if (selectedTemplate) {
      onSave(selectedTemplate.id, editData);
    }
  };

  const insertVariable = (variable: string) => {
    setEditData((prev) => ({
      ...prev,
      body_html: (prev.body_html || "") + `{{${variable}}}`,
    }));
  };

  if (templates.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No email templates found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Template Selector */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label>Select Template</Label>
          <Select value={selectedKey} onValueChange={setSelectedKey}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.template_key} value={template.template_key}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selectedTemplate && (
          <div className="flex items-end gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="template-active">Active</Label>
              <Switch
                id="template-active"
                checked={selectedTemplate.is_active}
                onCheckedChange={(checked) =>
                  onToggle(selectedTemplate.id, checked)
                }
              />
            </div>
          </div>
        )}
      </div>

      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedTemplate.name}</CardTitle>
            <CardDescription>
              Template key: <code>{selectedTemplate.template_key}</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Subject Line */}
            <div className="space-y-2">
              <Label htmlFor="subject">Subject Line</Label>
              <Input
                id="subject"
                value={editData.subject || ""}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, subject: e.target.value }))
                }
                placeholder="Email subject..."
              />
            </div>

            {/* Available Variables */}
            <div className="space-y-2">
              <Label>Available Variables (click to insert)</Label>
              <div className="flex flex-wrap gap-2">
                {selectedTemplate.variables.map((variable) => (
                  <Badge
                    key={variable}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => insertVariable(variable)}
                  >
                    <Code className="w-3 h-3 mr-1" />
                    {`{{${variable}}}`}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Body Editor */}
            <Tabs value={previewTab} onValueChange={(v) => setPreviewTab(v as "edit" | "preview")}>
              <TabsList>
                <TabsTrigger value="edit">Edit HTML</TabsTrigger>
                <TabsTrigger value="preview">
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </TabsTrigger>
              </TabsList>
              <TabsContent value="edit" className="mt-4">
                <Textarea
                  value={editData.body_html || ""}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, body_html: e.target.value }))
                  }
                  placeholder="Enter HTML email body..."
                  className="font-mono min-h-[300px]"
                />
              </TabsContent>
              <TabsContent value="preview" className="mt-4">
                <div className="border rounded-lg p-4 bg-white min-h-[300px]">
                  <div className="mb-4 pb-4 border-b">
                    <p className="text-sm text-muted-foreground">Subject:</p>
                    <p className="font-medium">
                      {renderTemplate(editData.subject || "", sampleVariables)}
                    </p>
                  </div>
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: renderTemplate(
                        editData.body_html || "",
                        sampleVariables
                      ),
                    }}
                  />
                </div>
              </TabsContent>
            </Tabs>

            {/* Plain Text Fallback */}
            <div className="space-y-2">
              <Label htmlFor="body_text">Plain Text Version (optional)</Label>
              <Textarea
                id="body_text"
                value={editData.body_text || ""}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, body_text: e.target.value }))
                }
                placeholder="Plain text email body for non-HTML clients..."
                className="min-h-[100px]"
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save Template"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
