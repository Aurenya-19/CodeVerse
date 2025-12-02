import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  imageUrl: string;
  link: string;
  source: string;
}

export default function News() {
  const { data: news = [] } = useQuery<NewsItem[]>({
    queryKey: ["/api/news"],
    retry: 1,
  });

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Tech News & Updates</h1>
          <p className="text-slate-300">Latest technology breakthroughs and industry insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.length > 0 ? (
            news.map((item) => (
              <Card key={item.id} className="bg-slate-900 border-slate-700 hover-elevate cursor-pointer overflow-hidden" data-testid={`card-news-${item.id}`}>
                <div className="relative h-48 overflow-hidden bg-slate-800">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant="outline" className="text-xs" data-testid={`badge-category-${item.category}`}>
                      {item.category}
                    </Badge>
                    <Badge variant="secondary" className="text-xs" data-testid={`badge-source-${item.source}`}>
                      {item.source}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg text-white line-clamp-2" data-testid={`text-title-${item.id}`}>{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-slate-300 line-clamp-3" data-testid={`text-description-${item.id}`}>{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-400" data-testid={`text-date-${item.id}`}>
                      <Calendar className="w-4 h-4" />
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 transition-colors"
                      data-testid={`link-read-${item.id}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-400 mb-2">Loading latest news...</p>
              <div className="flex gap-2 justify-center">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-20 h-40 bg-slate-800 rounded-md animate-pulse"></div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
