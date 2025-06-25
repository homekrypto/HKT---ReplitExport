import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileArchive, Package, AlertTriangle } from "lucide-react";

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
              Download HKT Complete Project
            </h1>
            <p className="text-xl text-muted-foreground">
              Get the complete source code for the Home Krypto Token investment platform
            </p>
          </div>

          {/* Important Instructions */}
          <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200">Download Instructions</h3>
                  <p className="text-blue-700 dark:text-blue-300 mt-1">
                    <strong>Access via HTTP:</strong> Use <code>http://homekrypto.com/download</code> (not HTTPS) to avoid SSL certificate issues. 
                    If buttons don't work, download directly from the Replit file manager.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Download Options */}
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileArchive className="h-5 w-5" />
                  Complete Project (TAR.GZ)
                </CardTitle>
                <CardDescription>
                  71MB compressed file with all source code, dependencies, and assets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full mb-4" 
                  onClick={() => window.open('/api/download-complete', '_blank')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download TAR.GZ (71MB)
                </Button>
                <p className="text-sm text-muted-foreground">
                  Ready for immediate download. Contains everything needed to run the platform.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Everything Included Package
                </CardTitle>
                <CardDescription>
                  Complete project with ALL files, dependencies, assets, and configurations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full mb-4"
                  onClick={() => window.open('/api/download-complete-zip', '_blank')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Everything (TAR.GZ)
                </Button>
                <p className="text-sm text-muted-foreground">
                  Complete project with ALL files ready to extract and run immediately.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* What's Included */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>What's Included (Complete Package)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">Frontend Features</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Complete React app with 23 pages</li>
                    <li>• Investment tracking dashboard</li>
                    <li>• Property showcase and portfolio</li>
                    <li>• Multi-wallet integration</li>
                    <li>• Dark/light theme support</li>
                    <li>• Responsive mobile design</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Backend Features</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Express.js API with TypeScript</li>
                    <li>• PostgreSQL database integration</li>
                    <li>• User authentication system</li>
                    <li>• Email verification and SMTP</li>
                    <li>• HKT token price monitoring</li>
                    <li>• Blog system with CMS</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Setup Instructions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Quick Setup Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">1</div>
                  <div>
                    <p className="font-medium">Extract the downloaded file</p>
                    <p className="text-sm text-muted-foreground">Use tar -xzf or your preferred extraction tool</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">2</div>
                  <div>
                    <p className="font-medium">Create environment file</p>
                    <p className="text-sm text-muted-foreground">Add your DATABASE_URL to .env file</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">3</div>
                  <div>
                    <p className="font-medium">Set up database</p>
                    <p className="text-sm text-muted-foreground">Run: npm run db:push</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">4</div>
                  <div>
                    <p className="font-medium">Start development server</p>
                    <p className="text-sm text-muted-foreground">Run: npm run dev</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">5</div>
                  <div>
                    <p className="font-medium">Access your platform</p>
                    <p className="text-sm text-muted-foreground">Open http://localhost:5000</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alternative Method */}
          <Card>
            <CardHeader>
              <CardTitle>Alternative Download Method</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">If the direct download buttons don't work, follow these steps:</p>
              <ol className="space-y-2 text-sm">
                <li>1. Open your Replit project file manager</li>
                <li>2. Look for these files in the root directory:</li>
                <li className="ml-4">• <code className="bg-muted px-2 py-1 rounded">homekrypto-complete-project.tar.gz</code> (71MB)</li>
                <li className="ml-4">• <code className="bg-muted px-2 py-1 rounded">homekrypto-source-code.tar.gz</code> (328KB)</li>
                <li>3. Right-click on the file you want</li>
                <li>4. Select "Download" from the context menu</li>
              </ol>
            </CardContent>
          </Card>

          <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-red-800 dark:text-red-200 mb-3">Current SSL Issue Notice</h3>
              <p className="text-red-700 dark:text-red-300 text-sm mb-3">
                The domain has SSL certificate issues. For the best experience:
              </p>
              <ul className="text-red-700 dark:text-red-300 text-sm space-y-1">
                <li>• Access via: <code className="bg-red-100 dark:bg-red-900 px-2 py-1 rounded">http://homekrypto.com/download</code></li>
                <li>• Use Replit file manager as backup download method</li>
                <li>• Files are ready: homekrypto-complete-project.tar.gz (71MB)</li>
              </ul>
            </CardContent>
          </Card>

          <div className="text-center mt-8 text-sm text-muted-foreground">
            <p><strong>Live Demo:</strong> <a href="http://homekrypto.com" className="text-primary hover:underline">http://homekrypto.com</a></p>
            <p><strong>Support:</strong> support@homekrypto.com</p>
            <p className="mt-2">Generated: June 25, 2025 • Home Krypto Token Investment Platform</p>
          </div>
        </div>
      </div>
    </div>
  );
}