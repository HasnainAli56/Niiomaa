# NIIOMA Landing Page

Custom-built high-performance landing page for **NIIOMA - The New Operating System for Global Business**, faithfully replicating the Figma design with Next.js 14, Tailwind CSS, Framer Motion, and scalable vector typography.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, React 18, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom Glassmorphism & Neon Arc effects
- **Typography**: Google Font **Rethink Sans**
- **Icons & Motion**: [Lucide React](https://lucide.dev/) & [Framer Motion](https://www.framer.com/motion/)
- **CMS Ready**: Decoupled Content Schema (`src/content/landing-content.ts`) ready for **Plasmic** or any headless CMS
- **Hosting Ready**: **AWS Amplify** (`amplify.yml` included)

---

## 📁 Project Structure

```
├── amplify.yml                # AWS Amplify deployment build specification
├── public/
│   └── images/
│       ├── hero-arc.png       # Glowing blue neon arc background
│       ├── niioma-vector.svg  # Precision vector logo
│       └── mockup-ref.png     # Original design reference
├── src/
│   ├── app/
│   │   ├── globals.css        # Rethink Sans font, frosted glass, custom scrollbar
│   │   ├── layout.tsx         # Metadata, SEO tags, viewport configuration
│   │   └── page.tsx           # Main Landing Page canvas
│   ├── components/
│   │   ├── DropdownMenu.tsx   # Glassmorphic interactive dropdowns
│   │   ├── HeroArc.tsx        # High-res glowing arc background with ambient glow
│   │   ├── HeroContent.tsx    # "The New Operating System for Global Business" & CTA
│   │   ├── MobileMenu.tsx     # Responsive slide-over drawer for mobile/tablet
│   │   ├── Navbar.tsx         # Floating pill navbar (Logo, navigation, Sign in, Language)
│   │   ├── NavbarLogo.tsx     # Winged falcon chevron icon + NIIOMA brand
│   │   ├── NiiomaWordmark.tsx # Precision SVG vector of giant NIIOMA letters
│   │   └── SignInModal.tsx    # Enterprise access sign-in preview modal
│   └── content/
│       ├── landing-content.ts # Decoupled Headless CMS content model
│       └── plasmic-init.ts    # Plasmic CMS integration layer & docs
```

---

## 💻 Local Development

### 1. Install dependencies:
```bash
npm install
```

### 2. Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production build:
```bash
npm run build
npm run start
```

---

## 🔌 Headless CMS Integration (Plasmic)

The text content, menu links, dropdown items, language options, and call-to-action buttons are completely decoupled in `src/content/landing-content.ts`.

### Connecting Plasmic:
1. Install the Plasmic loader:
   ```bash
   npm install @plasmicapp/loader-nextjs
   ```
2. Create `.env.local`:
   ```env
   NEXT_PUBLIC_PLASMIC_PROJECT_ID=your-project-id
   PLASMIC_API_TOKEN=your-plasmic-api-token
   ```
3. Follow the instructions in `src/content/plasmic-init.ts` to bind dynamic visual components or editable copy directly from Plasmic Studio.

---

## ☁️ Deployment on AWS Amplify

The repository includes a ready-to-deploy `amplify.yml`:

1. Push this repository to **GitHub**, **GitLab**, or **AWS CodeCommit**.
2. Go to the [AWS Amplify Console](https://console.aws.amazon.com/amplify/).
3. Click **Host web app** and connect your repository.
4. AWS Amplify will automatically detect the Next.js framework and `amplify.yml`.
5. Click **Save and deploy**. Your landing page will be deployed to a global AWS CloudFront CDN with SSL and automatic CI/CD deployments on every git commit.
