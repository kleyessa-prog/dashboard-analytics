import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      {items.map((item, index) => (
        <div key={item.path} className="flex items-center">
          {index > 0 && <ChevronRight size={16} className="mx-2 text-gray-400" />}
          {index === items.length - 1 ? (
            <span className="font-semibold text-primary-700">{item.label}</span>
          ) : (
            <Link
              to={item.path}
              className="hover:text-primary-600 transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};
