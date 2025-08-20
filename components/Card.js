export default function Card({ title, subtitle, children, actions, className = "" }) {
  return (
    <div className={`rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-200 ease-out hover:-translate-y-1 hover:scale-[1.02] ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 px-6 py-4 transition-all duration-200 ease-out">
          <div className="transition-all duration-200 ease-out">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">{title}</h3>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2 transition-all duration-200 ease-out">
              {actions}
            </div>
          )}
        </div>
      )}
      <div className="p-6 transition-all duration-200 ease-out">
        {children}
      </div>
    </div>
  );
}
