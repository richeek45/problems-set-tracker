import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"

export default function Sidebar() {
  return (
    <div className="hidden md:flex flex-col w-[240px] border-r border-gray-200 dark:border-gray-800">
    <div className="flex-1 overflow-y-auto">
      <nav className="flex-1 px-2 space-y-1">
        <Accordion collapsible type="single">
          <AccordionItem value="dashboard">
            <AccordionTrigger className="flex items-center h-10 px-3 text-sm font-semibold text-gray-900 border-l-2 border-transparent dark:text-gray-100">
              Account Settings
            </AccordionTrigger>
            <AccordionContent>
              <Link
                className="flex items-center h-10 px-3 text-sm font-semibold text-gray-900 border-l-2 border-transparent dark:text-gray-100"
                href="#"
              >
                Dashboard
              </Link>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="orders">
            <AccordionTrigger className="flex items-center h-10 px-3 text-sm font-semibold text-gray-900 border-l-2 border-transparent dark:text-gray-100">
              Activity
            </AccordionTrigger>
            <AccordionContent>
              <Link
                className="flex items-center h-10 px-3 text-sm font-semibold text-gray-900 border-l-2 border-transparent dark:text-gray-100"
                href="#"
              >
                Orders
              </Link>
              <Link
                className="flex items-center h-10 px-3 text-sm font-semibold text-gray-900 border-l-2 border-transparent dark:text-gray-100"
                href="#"
              >
                New Order
              </Link>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="products">
            <AccordionTrigger className="flex items-center h-10 px-3 text-sm font-semibold text-gray-900 border-l-2 border-transparent dark:text-gray-100">
              Favourites
            </AccordionTrigger>
            <AccordionContent>
              <Link
                className="flex items-center h-10 px-3 text-sm font-semibold text-gray-900 border-l-2 border-transparent dark:text-gray-100"
                href="#"
              >
                Products
              </Link>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="problemset">
            <AccordionTrigger className="flex items-center h-10 px-3 text-sm font-semibold text-gray-900 border-l-2 border-transparent dark:text-gray-100">
              Problem Set
            </AccordionTrigger>
            <AccordionContent>
              <Link
                className="flex items-center h-10 px-3 text-sm font-semibold text-gray-900 border-l-2 border-transparent dark:text-gray-100"
                href="#"
              >
                Products
              </Link>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="customers" />
        </Accordion>
      </nav>
    </div>
  </div>
  )
}