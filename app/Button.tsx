export default function Button({ type, disabled, children, onClick }: { type?: 'button' | 'submit', disabled?: boolean, children: React.ReactNode, onClick?: () => void }) {
  if (!type) type = 'button';
  console.log('disabled', disabled);

  return (
    <button type={type} disabled={disabled} onClick={onClick} className="hyah-button">
      {children}
    </button>
  )
}