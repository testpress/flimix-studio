import React, { useEffect } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationProps {
  type: NotificationType;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  isVisible,
  onClose,
  duration = 5000
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  // Get styling based on type
  const getStyling = () => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-green-50 border-green-300',
          text: 'text-green-800',
          icon: 'text-green-400',
          button: 'bg-green-50 text-green-500 hover:bg-green-100 focus:ring-offset-green-50 focus:ring-green-600'
        };
      case 'error':
        return {
          container: 'bg-red-50 border-red-300',
          text: 'text-red-800',
          icon: 'text-red-400',
          button: 'bg-red-50 text-red-500 hover:bg-red-100 focus:ring-offset-red-50 focus:ring-red-600'
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-300',
          text: 'text-yellow-800',
          icon: 'text-yellow-400',
          button: 'bg-yellow-50 text-yellow-500 hover:bg-yellow-100 focus:ring-offset-yellow-50 focus:ring-yellow-600'
        };
      default:
        return {
          container: 'bg-indigo-50 border-indigo-300',
          text: 'text-indigo-800',
          icon: 'text-indigo-400',
          button: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 focus:ring-offset-indigo-50 focus:ring-indigo-700'
        };
    }
  };

  const styling = getStyling();

  // Get icon SVG based on type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className={`h-5 w-5 ${styling.icon}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className={`h-5 w-5 ${styling.icon}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
            <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className={`h-5 w-5 ${styling.icon}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
            <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className="w-full absolute flex flex-col items-center gap-2 z-50 top-2">
      <div className={`rounded border ${styling.container} py-1.5 px-3`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3">
            <p className={`text-sm font-medium ${styling.text}`}>
              {message}
            </p>
          </div>
          <div className="ml-auto pl-3">
            <div className="h-5 w-5">
              <button
                type="button"
                onClick={onClose}
                className={`inline-flex rounded-sm focus:outline-none focus:ring-2 ${styling.button}`}
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
