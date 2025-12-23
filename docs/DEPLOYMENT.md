# 🚀 Deployment Guide

This project uses automated deployment to multiple destinations on every push to `main`.

## Deployment Targets

### 1. **Main Application** 
**URL:** https://joshuajdevine.github.io/tessitura/

The full React web application is deployed to the root of GitHub Pages. This is your main user-facing application where people can:
- Organize their music plugins
- Create instrument groups
- Use templates
- Manage their music production library

### 2. **Documentation Site**
**URL:** https://joshuajdevine.github.io/tessitura/docs/

A beautiful, styled documentation site is automatically generated and deployed to `/docs`. This includes:
- README and CHANGELOG
- Architecture documentation
- Data model and state management guides
- All markdown files converted to styled HTML

### 3. **GitHub Wiki** 
**URL:** https://github.com/JoshuaJDevine/tessitura/wiki

The GitHub Wiki is automatically synchronized with your documentation. Perfect for:
- Easy editing through GitHub's interface
- Community contributions
- Searchable documentation
- Version history

## How It Works

### Automatic Deployment

Every push to `main` triggers the deployment workflow (`.github/workflows/deploy.yml`), which:

1. **Builds the React app** using Vite
2. **Generates documentation site** with styled HTML
3. **Converts markdown to HTML** with GitHub styling
4. **Deploys everything to GitHub Pages**
5. **Updates the GitHub Wiki** with latest docs

### Manual Deployment

You can also trigger deployment manually:
1. Go to **Actions** tab on GitHub
2. Select **Deploy App & Documentation** workflow
3. Click **Run workflow** button

## File Structure After Deployment

```
https://joshuajdevine.github.io/tessitura/
├── index.html              # Main React app
├── assets/                 # JS, CSS, images
└── docs/                   # Documentation site
    ├── index.html          # Docs homepage
    ├── README.html         # Converted markdown
    ├── CHANGELOG.html      # Version history
    └── architecture/       # Architecture docs
        ├── decisions.html
        ├── data-model.html
        └── state-management.html
```

## Configuration

### Vite Base Path

The `vite.config.ts` sets the correct base path:
- **Production:** `/tessitura/` (GitHub Pages subdirectory)
- **Development:** `./` (relative paths for local development)

### GitHub Pages Settings

Ensure these settings in your GitHub repository:
1. Go to **Settings** → **Pages**
2. **Source:** GitHub Actions
3. **Branch:** Deployed via workflow (not manual branch selection)

### Enabling GitHub Wiki

To enable the Wiki auto-update feature:
1. Go to **Settings** → **General**
2. Scroll to **Features**
3. Check **✓ Wikis**

## Workflow File

The deployment is defined in `.github/workflows/deploy.yml`:
- Runs on every push to `main`
- Can be manually triggered
- Builds app and docs in parallel
- Updates wiki after successful deployment

## Troubleshooting

### App Not Loading
- Check GitHub Actions for failed builds
- Verify `base` path in `vite.config.ts` is `/tessitura/`
- Ensure GitHub Pages is enabled and using GitHub Actions source

### Documentation Not Updating
- Check if markdown files are in the `docs/` directory
- Verify workflow has completed successfully
- Clear browser cache and hard refresh

### Wiki Not Updating
- Ensure Wiki is enabled in repository settings
- Check workflow logs for wiki update step
- Verify wiki repository exists (created automatically when Wiki is enabled)

## Local Testing

### Test App Build
```bash
npm run build
npm run preview
```

### Test Documentation Generation
The documentation is generated during the GitHub Actions workflow. To preview locally, you can serve the markdown files using any markdown viewer.

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Wiki Documentation](https://docs.github.com/en/communities/documenting-your-project-with-wikis)
- [Vite Build Configuration](https://vitejs.dev/guide/build.html)


