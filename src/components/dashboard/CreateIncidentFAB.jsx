export default function CreateIncidentFAB({ onClick }) {
  return (
    <div className="fixed bottom-8 right-8">
      <button 
        onClick={onClick}
        className="bg-primary text-on-primary w-14 h-14 flex items-center justify-center border-4 border-white hover:scale-105 active:scale-95 transition-transform"
        style={{ boxShadow: '0 0 0 2px black' }}
      >
        <span className="material-symbols-outlined">add</span>
      </button>
    </div>
  );
}