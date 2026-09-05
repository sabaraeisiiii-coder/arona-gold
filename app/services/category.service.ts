import { categories as fixtures } from '../data/mock/categories';
export async function getCategories(){return fixtures.filter(category=>category.status==='active')}
export async function getCategoryBySlug(slug:string){return fixtures.find(category=>category.status==='active'&&category.slug===slug)}
export const categoryService={getCategories,getCategoryBySlug};
