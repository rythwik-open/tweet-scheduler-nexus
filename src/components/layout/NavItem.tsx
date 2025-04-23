
import { Link } from 'react-router-dom';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  expanded: boolean;
}

const NavItem = ({ icon: Icon, label, to, expanded }: NavItemProps) => {
  return (
    <Link
      to={to}
      className="neumorphic p-3 rounded-full flex items-center justify-center text-primary hover:opacity-80 transition-opacity button-inflated active:pressed"
    >
      <Icon className="h-5 w-5" />
      {expanded && <span className="ml-3 text-sm">{label}</span>}
    </Link>
  );
};

export default NavItem;

