
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { PageContainer } from '@ant-design/pro-layout';
import { Typography, Table } from 'antd';

import styles from './index.less';

const { Title } = Typography;

const staticData: any[] = [];

const listData: any = () => staticData.concat((new Array(10).fill({
  title: 'Ant Design Title ',
}).map((item, index) => ({
  key: index,
  title: `${item.title}${index + 1}`,
  hot: Math.floor(Math.random() * 101)
}))));

export default (): React.ReactNode => {
  const [dataSource, setDataSource] = useState(listData);

  const columns: any = useMemo(() => [{
    dataIndex: 'title',
    title: '标题',
    className: styles.colTitle
  }, {
    dataIndex: 'hot',
    title: '热度',
    className: styles.colHot
  }], []);
  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const [removed] = dataSource.splice(result.source.index, 1);
    dataSource.splice(result.destination.index, 0, removed);
    setDataSource([...dataSource]);
  }

  const getItemStyle = (isDragging: any, draggableStyle: any) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    background: isDragging ? "lightgreen" : "#fff",
    display: 'table-row',
    // styles we need to apply on draggables
    ...draggableStyle
  });
  return (
    <PageContainer>
      <div className={styles.header}>
        <Title style={{ marginBottom: 0 }} level={3}>表格排序 - 拖拽排序</Title>
      </div>
      <Table
        onRow={(record, index): any => {
          return {
            index,
            idVal: record.key
          }
        }}
        components={{
          table: (props: any) => {
            const {children, ...rest} = props;
            return <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId={`droppable`}>
                {
                  (provided: any, snapshot: any) => (
                    <table key="table" ref={provided.innerRef} {...rest}>
                      {
                        React.cloneElement(children[0])
                      }
                      {
                        React.cloneElement(children[1])
                      }
                      {
                        React.cloneElement(children[2], {
                          children: (children[2].props.children || []).concat([<React.Fragment key="placeholder">{provided.placeholder}</React.Fragment>])
                        })
                      }
                    </table>
                  )
                }
              </Droppable>
            </DragDropContext>
          },
          body: {
            row: (props: any) => {
              const {index, idVal, ...rest} = props;
              return (<Draggable key={`droppable-${idVal}`} draggableId={`droppable-${idVal}`} index={index}>
                {(provided: any, snapshot: any) => {
                  return (
                    <tr
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      {...rest}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                      // {...rest}
                    />
                  )
                }}
              </Draggable>)
            }
            
          }
        }}
        dataSource={dataSource}
        pagination={false}
        columns={columns}
      />
    </PageContainer>
  )
};

