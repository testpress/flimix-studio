// Import default JSON schemas and provide proper typing
import type { HeaderSchema } from '../editor/header/schema';
import type { FooterSchema } from '../editor/footer/schema';
import headerSchemaData from './headerSchema.json';
import footerSchemaData from './footerSchema.json';

// Export typed default schemas
export const defaultHeaderSchema: HeaderSchema = headerSchemaData as HeaderSchema;
export const defaultFooterSchema: FooterSchema = footerSchemaData as FooterSchema;

