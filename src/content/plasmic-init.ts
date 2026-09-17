/**
 * Plasmic CMS Integration Layer
 * 
 * To connect your Plasmic project:
 * 1. Run: npm install @plasmicapp/loader-nextjs
 * 2. Add your project credentials to .env.local:
 *    PLASMIC_PROJECT_ID=your-project-id
 *    PLASMIC_API_TOKEN=your-api-token
 * 3. Use PLASMIC.maybeFetchComponentData(componentName) to render dynamic CMS components.
 */

export interface PlasmicConfig {
  projectId?: string;
  preview?: boolean;
}

export const PLASMIC_PROJECT_ID = process.env.NEXT_PUBLIC_PLASMIC_PROJECT_ID || "";
export const PLASMIC_API_TOKEN = process.env.PLASMIC_API_TOKEN || "";

export const isPlasmicConfigured = () => {
  return Boolean(PLASMIC_PROJECT_ID);
};
