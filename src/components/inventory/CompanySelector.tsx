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
  const [selectedCompany, setSelectedCompany] = useState<string>('');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('companies')
          .select('company_id, name')
          .order('name');

        if (error) {
          console.error('Error al cargar las compañías:', error);
          return;
        }

        if (data && data.length > 0) {
          setCompanies(data);
          const defaultCompanyId = data[0].company_id.toString();
          setSelectedCompany(defaultCompanyId);
          onCompanyChange(data[0].company_id);
        }
      } catch (error) {
        console.error('Error al cargar las compañías:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleCompanyChange = (value: string) => {
    setSelectedCompany(value);
    onCompanyChange(parseInt(value));
  };

  if (loading) {
    return <div>Cargando compañías...</div>;
  }

  if (companies.length === 0) {
    return <div>No hay compañías disponibles</div>;
  }

  return (
    <div className="w-full md:w-64">
      <Select 
        value={selectedCompany}
        onValueChange={handleCompanyChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleccionar compañía" />
        </SelectTrigger>
        <SelectContent>
          {companies.map((company) => (
            <SelectItem key={company.company_id} value={company.company_id.toString()}>
              {company.name || `Compañía ${company.company_id}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CompanySelector;
