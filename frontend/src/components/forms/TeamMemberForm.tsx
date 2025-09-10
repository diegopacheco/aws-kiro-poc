import React, { useState } from 'react';
import { Input, FileUpload, Button, Card } from '../common';
import { validateTeamMember } from '../../utils/validation';
import { FormErrors } from '../../types';

interface TeamMemberFormProps {
  onSubmit: (data: { name: string; email: string; picture?: string }) => void;
  loading?: boolean;
}

export const TeamMemberForm: React.FC<TeamMemberFormProps> = ({ onSubmit, loading = false }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [picture, setPicture] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});

  const handleFileSelect = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPicture(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPicture('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateTeamMember(name, email);
    setErrors(validation.errors);

    if (validation.isValid) {
      onSubmit({
        name,
        email,
        picture: picture || undefined
      });
      setName('');
      setEmail('');
      setPicture('');
    }
  };

  return (
    <Card title="Add Team Member">
      <form onSubmit={handleSubmit}>
        <Input
          label="Name"
          value={name}
          onChange={setName}
          required
          error={errors.name}
          placeholder="Enter member name"
        />
        
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          required
          error={errors.email}
          placeholder="Enter email address"
        />
        
        <FileUpload
          label="Profile Picture"
          onFileSelect={handleFileSelect}
          preview={picture}
        />
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Team Member'}
        </Button>
      </form>
    </Card>
  );
};