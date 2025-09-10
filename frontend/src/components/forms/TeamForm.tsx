import React, { useState } from 'react';
import { Input, FileUpload, Button, Card } from '../common';
import { validateTeam } from '../../utils/validation';
import { FormErrors } from '../../types';

interface TeamFormProps {
  onSubmit: (data: { name: string; logo?: string }) => void;
  loading?: boolean;
}

export const TeamForm: React.FC<TeamFormProps> = ({ onSubmit, loading = false }) => {
  const [name, setName] = useState('');
  const [logo, setLogo] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});

  const handleFileSelect = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setLogo('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateTeam(name);
    setErrors(validation.errors);

    if (validation.isValid) {
      onSubmit({
        name,
        logo: logo || undefined
      });
      setName('');
      setLogo('');
    }
  };

  return (
    <Card title="Create Team">
      <form onSubmit={handleSubmit}>
        <Input
          label="Team Name"
          value={name}
          onChange={setName}
          required
          error={errors.name}
          placeholder="Enter team name"
        />
        
        <FileUpload
          label="Team Logo"
          onFileSelect={handleFileSelect}
          preview={logo}
        />
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Team'}
        </Button>
      </form>
    </Card>
  );
};