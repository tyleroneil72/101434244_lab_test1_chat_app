interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div className='flex flex-col'>
      <label className='mb-1 text-sm font-medium text-gray-700'>{label}</label>
      <input {...props} className='rounded-lg border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none' />
    </div>
  );
};

export default Input;
