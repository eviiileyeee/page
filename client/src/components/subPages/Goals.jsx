import { 
  ArrowPathIcon, 
  CloudArrowUpIcon, 
  FingerPrintIcon, 
  LockClosedIcon,
  BuildingOfficeIcon,
  DocumentCheckIcon,
  ShieldCheckIcon,
  MapIcon
} from '@heroicons/react/24/outline'
import { useTheme } from "../../context/ThemeContext/ThemeContext";

const features = [
  {
    name: 'Digital Land Registration',
    description:
      'Register your land properties digitally with our secure and efficient system. Upload documents, verify ownership, and get instant confirmation.',
    icon: DocumentCheckIcon,
  },
  {
    name: 'Property Verification',
    description:
      'Our advanced verification system ensures authenticity of land documents and ownership details, preventing fraud and disputes.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Land Survey Integration',
    description:
      'Seamlessly integrate with land survey data, providing accurate measurements and boundary information for your properties.',
    icon: MapIcon,
  },
  {
    name: 'Property Portfolio Management',
    description:
      'Manage multiple properties, track their status, and access all related documents in one centralized dashboard.',
    icon: BuildingOfficeIcon,
  },
]

export default function Goals() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="bg-white py-24 sm:py-32  transition-all 
            duration-500  dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center ">
          <h2 className="text-base/7 font-semibold text-indigo-600 dark:text-pink-600">Secure Land Management</h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl lg:text-balance dark:text-gray-200">
            Everything you need to manage your land properties
          </p>
          <p className="mt-6 text-lg/8 text-gray-600  dark:text-gray-400">
            Streamline your land registration and management process with our comprehensive platform
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base/7 font-semibold text-gray-900 dark:text-white">
                  <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600">
                    <feature.icon aria-hidden="true" className="size-6 text-white" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base/7 text-gray-600 dark:text-gray-400">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
