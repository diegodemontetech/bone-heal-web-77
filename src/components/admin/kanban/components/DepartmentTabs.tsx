
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Department } from "@/types/crm";

interface DepartmentTabsProps {
  departments: Department[];
  selectedDepartment: string | null;
  onDepartmentChange: (value: string) => void;
}

const DepartmentTabs = ({ 
  departments, 
  selectedDepartment, 
  onDepartmentChange 
}: DepartmentTabsProps) => {
  if (departments.length <= 1) return null;
  
  return (
    <Tabs
      value={selectedDepartment || ""}
      onValueChange={onDepartmentChange}
      className="mb-6"
    >
      <TabsList className="mb-2">
        {departments.map((department) => (
          <TabsTrigger key={department.id} value={department.id}>
            {department.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default DepartmentTabs;
