import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Button } from "./ui/button"
import { Users, Truck, Building2, Store, UserCircle, User } from 'lucide-react'
import ContactsList from './contacts/ContactsList'
import Suppliers from './contacts/Suppliers'
import Distributors from './contacts/Distributors'
import WholesaleBuyers from './contacts/WholesaleBuyers'
import Employees from './contacts/Employees'
import Customers from './contacts/Customers'

const Contacts: React.FC = () => {
  return (
    <div className="custom-card p-6">
      <Tabs defaultValue="contacts" className="w-full">
        <TabsList className="grid w-full grid-cols-6 gap-4">
          <TabsTrigger value="contacts" asChild>
            <Button variant="outline" className="custom-button w-full">
              <Users className="mr-2 h-4 w-4" />
              Contacts
            </Button>
          </TabsTrigger>
          <TabsTrigger value="suppliers" asChild>
            <Button variant="outline" className="custom-button w-full">
              <Truck className="mr-2 h-4 w-4" />
              Suppliers
            </Button>
          </TabsTrigger>
          <TabsTrigger value="distributors" asChild>
            <Button variant="outline" className="custom-button w-full">
              <Building2 className="mr-2 h-4 w-4" />
              Distributors
            </Button>
          </TabsTrigger>
          <TabsTrigger value="wholesaleBuyers" asChild>
            <Button variant="outline" className="custom-button w-full">
              <Store className="mr-2 h-4 w-4" />
              Wholesale Buyers
            </Button>
          </TabsTrigger>
          <TabsTrigger value="employees" asChild>
            <Button variant="outline" className="custom-button w-full">
              <UserCircle className="mr-2 h-4 w-4" />
              Employees
            </Button>
          </TabsTrigger>
          <TabsTrigger value="customers" asChild>
            <Button variant="outline" className="custom-button w-full">
              <User className="mr-2 h-4 w-4" />
              Customers
            </Button>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="contacts">
          <ContactsList />
        </TabsContent>
        <TabsContent value="suppliers">
          <Suppliers />
        </TabsContent>
        <TabsContent value="distributors">
          <Distributors />
        </TabsContent>
        <TabsContent value="wholesaleBuyers">
          <WholesaleBuyers />
        </TabsContent>
        <TabsContent value="employees">
          <Employees />
        </TabsContent>
        <TabsContent value="customers">
          <Customers />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Contacts