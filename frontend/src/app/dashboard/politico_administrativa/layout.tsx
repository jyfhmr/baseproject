'use client';
import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme } from 'antd';

const { Sider, Content } = Layout;

const App = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
  
    return (
        <div>
          
            {children}
           

        </div>
                    
    
    );
};

export default App;