'use client';
import { useState } from 'react';
import { Input, Textarea } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { FormSection } from './FormSection';
import { AdminTabs } from './AdminTabs';
import { resourceConfig, type AdminRecord } from './resource-config';
import type { AdminResource } from '../../mock/admin';

export function AdminRecordForm({ resource, record, onSave, onCancel }: {
  resource: AdminResource; record: AdminRecord; onSave: (record: AdminRecord) => void; onCancel?: () => void;
}) {
  const [draft, setDraft] = useState({ ...record });
  const [error, setError] = useState('');
  const fields = resourceConfig[resource].fields;
  const groups = [...new Set(fields.map(field => field.group || 'اطلاعات'))];
  const [tab, setTab] = useState(groups[0]);
  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!draft[fields[0].key]?.trim()) { setError(`${fields[0].label} را وارد کنید.`); setTab(groups[0]); return; }
    const invalid = fields.find(field => field.type === 'number' && draft[field.key] && (!Number.isFinite(Number(draft[field.key])) || Number(draft[field.key]) < 0));
    if (invalid) { setError(`${invalid.label} باید عدد غیرمنفی باشد.`); setTab(invalid.group || 'اطلاعات'); return; }
    const saved = { ...draft, id: draft.id || `draft-${crypto.randomUUID()}` };
    setDraft(saved); setError(''); onSave(saved);
  }
  const content = <FormSection title={tab} description="این فرم فقط پیش‌نویس آزمایشی پنل را تغییر می‌دهد.">
    <div className="admin-form-grid">
      {fields.filter(field => (field.group || 'اطلاعات') === tab).map(field => {
        const value = draft[field.key] || '';
        const change = (value: string) => setDraft(current => ({ ...current, [field.key]: value }));
        if (field.key === 'status') return <Select key={field.key} label={field.label} value={value} onChange={event => change(event.target.value)}>
          <option value="">انتخاب وضعیت</option>
          {[...new Set([value, 'فعال', 'غیرفعال', 'پیش‌نویس', 'active', 'inactive', 'draft', 'out_of_stock'])].filter(Boolean).map(status => <option key={status} value={status}>{status}</option>)}
        </Select>;
        if (field.key === 'dismissible') return <Select key={field.key} label={field.label} value={value} onChange={event => change(event.target.value)}><option value="">ثبت نشده</option><option>بله</option><option>خیر</option></Select>;
        return field.type === 'textarea'
          ? <Textarea key={field.key} label={field.label} value={value} rows={5} onChange={event => change(event.target.value)} />
          : <Input key={field.key} label={field.label} type={field.type || 'text'} min={field.type === 'number' ? 0 : undefined} step={field.type === 'number' ? 'any' : undefined}
            readOnly={field.key === 'count' || field.key === 'image'} hint={field.key === 'image' ? 'مدیریت و بارگذاری تصویر هنوز متصل نیست؛ تصویر موجود فقط نمایش داده می‌شود.' : undefined}
            value={value} onChange={event => change(event.target.value)} />;
      })}
    </div>
  </FormSection>;
  return <form className="admin-record-form" onSubmit={submit}>
    {groups.length > 1 ? <AdminTabs tabs={groups} active={tab} onChange={setTab}>{content}</AdminTabs> : content}
    {error && <p className="admin-form-error" role="alert">{error}</p>}
    <div className="admin-form-actions"><Button type="submit">ذخیره پیش‌نویس آزمایشی</Button>{onCancel && <Button variant="secondary" onClick={onCancel}>انصراف</Button>}</div>
  </form>;
}
