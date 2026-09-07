'use client';
import { useState } from 'react';
import { AdminResourcePage } from './AdminResourcePage';
import { useAdminDrafts } from './AdminDrafts';
import { useUiStore } from '../../store/UiStore';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Table } from '../ui/Table';
const modules = ['محصولات', 'سفارش‌ها', 'پرداخت‌ها', 'کاربران', 'محتوا', 'تنظیمات'];
const actions = ['مشاهده', 'ایجاد', 'ویرایش', 'حذف'];
export function AdminRoles() {
  const { records, save } = useAdminDrafts();
  const { notify } = useUiStore();
  const [selected, setSelected] = useState('');
  const [permissions, setPermissions] = useState<string[]>([]);
  const role = records.roles.find(role => role.id === selected);
  return <><AdminResourcePage resource="roles" title="نقش‌ها و دسترسی‌ها" description="نقش‌های موجود و پیش‌نمایش مجوزها." />
    <section className="ds-card admin-detail-card"><h2>ماتریس دسترسی‌های آزمایشی</h2><p className="admin-muted">سیستم مجوز واقعی متصل نیست؛ این انتخاب‌ها فقط پیش‌نویس UI هستند و هیچ دسترسی واقعی اعطا نمی‌کنند.</p>
      <Select label="نقش" value={selected} onChange={event => {
        const value = event.target.value; setSelected(value);
        setPermissions((records.roles.find(role => role.id === value)?.permissions || '').split('،').filter(Boolean));
      }}><option value="">انتخاب نقش</option>{records.roles.map(role => <option key={role.id} value={role.id}>{role.name}</option>)}</Select>
      <Table headers={['ماژول', ...actions]}>{modules.map(module => <tr key={module}><th scope="row">{module}</th>{actions.map(action => {
        const permission = `${module}: ${action}`;
        return <td key={action}><input type="checkbox" aria-label={permission} disabled={!role} checked={permissions.includes(permission)} onChange={event => setPermissions(current => event.target.checked ? [...current, permission] : current.filter(item => item !== permission))} /></td>;
      })}</tr>)}</Table>
      <Button disabled={!role} onClick={() => { if (role) { save('roles', { ...role, permissions: permissions.join('،') }); notify('ماتریس آزمایشی در حافظه پنل ذخیره شد'); } }}>ذخیره ماتریس آزمایشی</Button>
    </section>
  </>;
}
