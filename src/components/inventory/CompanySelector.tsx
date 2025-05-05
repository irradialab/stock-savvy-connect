
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface Company {
  company_id: number;
  name: string;
}

interface CompanySelectorProps {
  onCompanyChange: (companyId: number) => void;
}

const CompanySelector = ({ onCompanyChange }: CompanySelectorProps) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('company_id, name');

        if (error) {
          console.error('Error fetching companies:', error);
          return;
        }

        setCompanies(data || []);
        
        // Seleccionar la primera compañía por defecto si hay compañías
        if (data && data.length > 0) {
          onCompanyChange(data[0].company_id);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [onCompanyChange]);

  if (loading) {
    return <div>Cargando compañías...</div>;
  }

  if (companies.length === 0) {
    return <div>No hay compañías disponibles</div>;
  }

  return (
    <div className="w-full md:w-64">
      <Select 
        onValueChange={(value) => onCompanyChange(parseInt(value))}
        defaultValue={companies[0]?.company_id.toString()}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleccionar compañía" />
        </SelectTrigger>
        <SelectContent>
          {companies.map((company) => (
            <SelectItem key={company.company_id} value={company.company_id.toString()}>
              {company.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CompanySelector;
