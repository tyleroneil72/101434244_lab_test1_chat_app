interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className='mt-4 cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700'
    >
      {children}
    </button>
  );
};

export default Button;
