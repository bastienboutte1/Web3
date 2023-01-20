import React from 'react';

import { Layout, Menu } from 'antd'

const { Header, Content } = Layout



const App = () => {

  return (
    <Layout className="layout">
    <Header>
      <Menu theme="dark" mode="horizontal" selectedKeys={[]}>
        <Menu.Item>Enfants</Menu.Item>
        <Menu.Item>Aide</Menu.Item>
      </Menu>
    </Header>
    <Content style={{ padding: '30px 50px' }}>
      <p>Mettez votre contenu ICI</p>
    </Content>
  </Layout>
  )
}

export default App
