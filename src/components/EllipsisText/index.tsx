import React, { useState, useEffect, useRef, useMemo } from 'react';

import { Tooltip } from 'antd';
import styles from './index.less';

interface IProps {
  text: any;
  rows?: number;
  style?: any;
  ellipsisStyle?: any;
  className?: any;
  ellipsisClassName?: any;
  tooltipProps?: any;
  disabledTooltip?: boolean;
}

export default (props: IProps) => {
  const {
    text,
    rows,
    style,
    ellipsisStyle,
    className,
    ellipsisClassName,
    tooltipProps,
    disabledTooltip,
  } = props;
  const [status, setStatus] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const targetRef: any = useRef(null);
  const compareRef: any = useRef(null);

  useEffect(() => {
    setStatus(0);
  }, [text]);

  useEffect(() => {
    if (status === 0 && targetRef.current) {
      const targetClientMap = targetRef.current.getBoundingClientRect();
      const compareClientMap = compareRef.current.getBoundingClientRect();
      setShowTooltip(
        !(
          targetClientMap.width + 2 > compareClientMap.width &&
          targetClientMap.height + 2 > compareClientMap.height
        ),
      );
      setStatus(1);
    }
  });

  const textClass = useMemo(() => {
    if (!rows || rows === 1) {
      return styles.singleLine;
    }

    return styles.multilines;
  }, []);

  if (status === 0) {
    return (
      <div style={{ position: 'relative' }}>
        <div
          ref={(c) => {
            targetRef.current = c;
          }}
          className={`${styles.ellipsis} ${textClass}`}
          style={{ WebkitLineClamp: rows || 1 }}
        >
          {text}
        </div>
        <div
          ref={(c) => {
            compareRef.current = c;
          }}
          className={styles.temp}
        >
          {text}
        </div>
      </div>
    );
  }
  if (status === 1) {
    if (showTooltip) {
      if (disabledTooltip) {
        return (
          <div
            className={`${styles.ellipsis} ${textClass} ${className || ''} ${
              ellipsisClassName || ''
            }`}
            style={{ WebkitLineClamp: rows || 1, ...(style || {}), ...(ellipsisStyle || {}) }}
          >
            {text}
          </div>
        );
      }

      return (
        <Tooltip title={text} {...(tooltipProps || {})}>
          <div
            className={`${styles.ellipsis} ${textClass} ${className || ''} ${
              ellipsisClassName || ''
            }`}
            style={{ WebkitLineClamp: rows || 1, ...(style || {}), ...(ellipsisStyle || {}) }}
          >
            {text}
          </div>
        </Tooltip>
      );
    }
  }

  return (
    <span className={className} style={style}>
      {text}
    </span>
  );
};
