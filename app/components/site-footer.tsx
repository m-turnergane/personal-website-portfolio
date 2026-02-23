import { SocialLinks } from "./social-links";
import { SubscribeTrigger } from "./subscribe-trigger";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/5 mt-20">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-sm text-neutral-500">
              © {currentYear} {siteConfig.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              <p className="text-xs text-neutral-600">
                Built with Next.js, TypeScript, and Tailwind CSS
              </p>
              <span className="text-neutral-700">&middot;</span>
              <SubscribeTrigger />
            </div>
          </div>

          <SocialLinks />
        </div>
      </div>
    </footer>
  );
}
