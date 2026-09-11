function PlaceholderBox({ id, type, width, height, label, className = '', style = {} }) {
  return (
    <div
      className={`flex items-center justify-center border-2 border-dashed border-gray-300 bg-gray-100 text-center p-4 ${className}`}
      style={{ width, height, minHeight: height, ...style }}
      data-placeholder-id={id}
    >
      <div className="text-xs text-gray-500 leading-tight">
        <div className="font-bold text-sm mb-1 text-gray-700">{type}</div>
        <div>{label}</div>
        <div className="text-[10px] text-gray-400 mt-1">ID: {id}</div>
      </div>
    </div>
  )
}

export default PlaceholderBox
