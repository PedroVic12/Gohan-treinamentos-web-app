import React, { useState } from 'react';
import { Menu, Home, ListTodo, Bell, RefreshCw } from 'lucide-react';

const menuItems = [
  { path: '/', icon: Home, text: 'Início' },
  { path: '/tasks', icon: ListTodo, text: 'Tarefas' },
  { path: '/notes', icon: Bell, text: 'Notes APP' },
];

const AppBarHeader = ({ onRefresh }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <header className="bg-gray-900 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <h1 className="ml-4 text-xl font-semibold">Gohan Treinamentos 2025</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Button 
                    key={index} 
                    variant="ghost" 
                    size="icon"
                    className="text-white"
                    onClick={() => window.location.href = item.path}
                  >
                    <Icon className="h-5 w-5" />
                  </Button>
                );
              })}
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white"
                onClick={onRefresh}
              >
                <RefreshCw className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Menu Lateral</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start gap-2 mb-2"
                  onClick={() => {
                    window.location.href = item.path;
                    setIsOpen(false);
                  }}
                >
                  <Icon className="h-5 w-5" />
                  {item.text}
                </Button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AppBarHeader;