import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useToast } from "../hooks/use-toast";

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean';
  value: string | number | boolean | Date;
  moduleType: string;
}

interface CustomFieldsManagerProps {
  moduleType: string;
  customFields: CustomField[];
  onAddField: (field: Omit<CustomField, 'id'>) => Promise<void>;
  onUpdateField: (fieldId: string, value: any) => Promise<void>;
  onDeleteField: (fieldId: string) => Promise<void>;
}

const CustomFieldsManager: React.FC<CustomFieldsManagerProps> = ({
  moduleType,
  customFields,
  onAddField,
  onUpdateField,
  onDeleteField
}) => {
  const { toast } = useToast();
  const [newField, setNewField] = useState({
    name: '',
    type: 'text' as const,
    value: '',
    moduleType: moduleType
  });

  const handleAddField = async () => {
    try {
      if (!newField.name.trim()) {
        toast({
          title: "Error",
          description: "Field name is required",
          variant: "destructive",
        });
        return;
      }

      await onAddField(newField);
      setNewField({
        name: '',
        type: 'text',
        value: '',
        moduleType: moduleType
      });

      toast({
        title: "Success",
        description: "Custom field added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add custom field",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Field Name"
          value={newField.name}
          onChange={(e) => setNewField({ ...newField, name: e.target.value })}
          className="flex-1"
        />
        <Select
          value={newField.type}
          onValueChange={(value: 'text' | 'number' | 'date' | 'boolean') => 
            setNewField({ ...newField, type: value })
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Field Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="boolean">Yes/No</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleAddField}>
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </Button>
      </div>

      <div className="space-y-2">
        {customFields.map((field) => (
          <div key={field.id} className="flex items-center gap-4 p-2 bg-gray-50 rounded">
            <span className="font-medium min-w-[150px]">{field.name}:</span>
            {field.type === 'boolean' ? (
              <Select
                value={field.value.toString()}
                onValueChange={(value) => onUpdateField(field.id, value === 'true')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Input
                type={field.type}
                value={field.value.toString()}
                onChange={(e) => {
                  const value = field.type === 'number' ? 
                    parseFloat(e.target.value) : 
                    e.target.value;
                  onUpdateField(field.id, value);
                }}
                className="flex-1"
              />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteField(field.id)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomFieldsManager;