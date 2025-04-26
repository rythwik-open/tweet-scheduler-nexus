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
      className={`neumorphic p-3 rounded-full flex items-center text-primary active:pressed ${
        expanded ? 'justify-start pl-4' : 'justify-center'
      }`}
    >
      <Icon className="h-5 w-5" />
      {expanded && <span className="ml-3 text-sm">{label}</span>}
    </Link>
  );
};

export default NavItem;