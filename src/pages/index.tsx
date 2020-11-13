import React from 'react';
import './index.less';
import { Layout, Menu, Breadcrumb } from 'antd';
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from '@ant-design/icons';
import { Link } from 'umi';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

export default (props: any) => {
  const footText = 'Copyright ©' + new Date().getFullYear() + ' ☆齐天☆';
  return (
    <Layout>
      <Header
        className="header"
        style={{ position: 'fixed', zIndex: 1, width: '100%' }}
      >
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">百货</Menu.Item>
          <Menu.Item key="2">笔记</Menu.Item>
          <Menu.Item key="3">有用的</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 10px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <Layout
          className="site-layout-background"
          style={{ padding: '24px 0' }}
        >
          <Sider className="styles.site-layout-background" width={200}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%' }}
            >
              <SubMenu key="sub1" icon={<UserOutlined />} title="娱乐">
                <Menu.Item key="1">
                  <Link to="/toy/worktime">工作时间</Link>
                </Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" icon={<LaptopOutlined />} title="工具">
                <Menu.Item key="5">计算器</Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub3"
                icon={<NotificationOutlined />}
                title="关于我"
              >
                <Menu.Item key="8">简介</Menu.Item>
                <Menu.Item key="9">
                  <a
                    href="https://github.com/qguangyaonpm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    我的github
                  </a>
                </Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: 280 }}>
            {props.children}
          </Content>
        </Layout>
      </Content>
      <Footer
        style={{
          textAlign: 'center',
          position: 'fixed',
          bottom: '0',
          width: '100%',
          height: '2rem',
          padding: '0.4rem'
        }}
      >
        {footText}
      </Footer>
    </Layout>
  );
};
