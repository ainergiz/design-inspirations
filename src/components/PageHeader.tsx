import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Code, ExternalLink } from "lucide-react";

interface InspirationProps {
  handle: string;
  imageUrl: string;
}

interface PageHeaderProps {
  title: string;
  codePath: string;
  inspiration: InspirationProps;
}

export function PageHeader({ title, codePath, inspiration }: PageHeaderProps) {
  const codeUrl = `https://github.com/ainergiz/design-inspirations/blob/main/src/app/${codePath}`;
  const twitterUrl = `https://x.com/${inspiration.handle}`;

  return (
    <header className="fixed top-0 left-0 right-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-base font-medium text-zinc-900">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <a
            href={codeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <Code className="w-4 h-4" />
            <span className="hidden sm:inline">Code</span>
          </a>
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
          >
            <span className="hidden sm:inline text-zinc-400">Inspired from</span>
            <Image
              src={inspiration.imageUrl}
              alt={inspiration.handle}
              width={24}
              height={24}
              className="w-6 h-6 rounded-full"
            />
            <span className="font-medium text-zinc-700">@{inspiration.handle}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
