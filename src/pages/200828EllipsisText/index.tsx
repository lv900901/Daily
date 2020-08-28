import React, {useMemo} from 'react';
// import { Typography } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { Typography } from 'antd';
import EllipsisText from '@/components/EllipsisText';

import styles from './index.less';

const { Title } = Typography;

export default (): React.ReactNode => {
  const config = useMemo(() => {
    return {
      noEllipsis: '有哪些可能引起前端安全的的问题?',
      ellipsisSingLine: '跨站脚本 (Cross-Site Scripting, XSS): 一种代码注入方式, 为了与 CSS 区分所以被称作 XSS. 早期常见于网络论坛, 起因是网站没有对用户的输入进行严格的限制, 使得攻击者可以将脚本上传到帖子让其他人浏览到有恶意脚本的页面, 其注入方式很简单包括但不限于 JavaScript / VBScript / CSS / Flash 等',
      noEllipsisMultLine: 'iframe的滥用: iframe中的内容是由第三方来提供的，默认情况下他们不受我们的控制，他们可以在iframe中运行JavaScirpt脚本、Flash插件、弹出对话框等等，这可能会破坏前端用户体验',
      ellipsisMultLine: '恶意第三方库: 无论是后端服务器应用还是前端应用开发，绝大多数时候我们都是在借助开发框架和各种类库进行快速开发,一旦第三方库被植入恶意代码很容易引起安全问题,比如event-stream的恶意代码事件,2018年11月21日，名为 FallingSnow的用户在知名JavaScript应用库event-stream在github Issuse中发布了针对植入的恶意代码的疑问，表示event-stream中存在用于窃取用户数字钱包的恶意代码',
      noTooltipInSingle: '跨站点请求伪造（Cross-Site Request Forgeries，CSRF）: 指攻击者通过设置好的陷阱，强制对已完成认证的用户进行非预期的个人信息或设定信息等某些状态更新，属于被动攻击',
      noTooltipInMult: '恶意第三方库: 无论是后端服务器应用还是前端应用开发，绝大多数时候我们都是在借助开发框架和各种类库进行快速开发,一旦第三方库被植入恶意代码很容易引起安全问题,比如event-stream的恶意代码事件,2018年11月21日，名为 FallingSnow的用户在知名JavaScript应用库event-stream在github Issuse中发布了针对植入的恶意代码的疑问，表示event-stream中存在用于窃取用户数字钱包的恶意代码'
    }
  }, []);
  return (
    <PageContainer>
      <Title level={3}>文本未超出正常显示，超出显示省略号，并加上toolTip</Title>
      <div style={{ width: 600 }}>
        <Title level={4}>单行未超出显示范围</Title>
        <div><EllipsisText text={config.noEllipsis} /></div>
        <Title style={{ marginTop: 24 }} level={4}>单行超出显示范围</Title>
        <div><EllipsisText tooltipProps={{ overlayStyle: { maxWidth: 600 } }} text={config.ellipsisSingLine} /></div>
        <Title style={{ marginTop: 24 }} level={4}>多行未超出显示范围</Title>
        <div><EllipsisText tooltipProps={{ overlayStyle: { maxWidth: 600 } }} rows={2} text={config.noEllipsisMultLine} /></div>
        <Title style={{ marginTop: 24 }} level={4}>多行超出显示范围</Title>
        <div><EllipsisText tooltipProps={{ overlayStyle: { maxWidth: 600 } }} rows={2} text={config.ellipsisMultLine} /></div>
        <Title style={{ marginTop: 24 }} level={4}>单行超出显示范围,但不显示tooltip</Title>
        <div><EllipsisText disabledTooltip text={config.noTooltipInSingle} /></div>
        <Title style={{ marginTop: 24 }} level={4}>多行超出显示范围,但不显示tooltip</Title>
        <div><EllipsisText disabledTooltip rows={2} text={config.noTooltipInMult} /></div>
      </div>
    </PageContainer>
  )
};
