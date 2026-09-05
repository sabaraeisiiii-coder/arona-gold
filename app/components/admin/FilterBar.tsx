import { Input } from '../ui/Input';
export function FilterBar(){return <div className="admin-tools"><Input label="جستجو" placeholder="جستجو..."/><label className="ds-field"><span className="ds-label">وضعیت</span><select className="ds-input"><option>همه وضعیت‌ها</option><option>فعال</option><option>غیرفعال</option></select></label></div>}
