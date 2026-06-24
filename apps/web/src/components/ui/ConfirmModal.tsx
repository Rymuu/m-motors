type Props = {
  message: string
  confirmLabel: string
  confirmVariant: 'success' | 'danger' | 'info'
  onConfirm: () => void
  onCancel: () => void
}

const VARIANT_CLASSES = {
  success: 'bg-[#16A34A] hover:bg-[#15803d]',
  danger: 'bg-[#DC2626] hover:bg-[#b91c1c]',
  info: 'bg-[#2563EB] hover:bg-[#1D4ED8]',
}

export default function ConfirmModal({ message, confirmLabel, confirmVariant, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="[font-family:var(--font-sora)] text-xl font-bold text-[#0E2A6B] mb-2">
          Confirmer l&apos;action
        </h2>
        <p className="text-[#5B6B82] text-sm mb-6">{message}</p>
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={onCancel}
            className="text-sm font-semibold px-5 py-2.5 rounded-full border border-[#E4E9F2] text-[#5B6B82] hover:bg-[#F5F8FD] transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className={`text-sm font-semibold px-5 py-2.5 rounded-full text-white transition-colors ${VARIANT_CLASSES[confirmVariant]}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}