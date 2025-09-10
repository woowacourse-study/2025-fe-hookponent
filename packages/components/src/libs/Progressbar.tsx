import { memo, useMemo } from 'react';

type ProgressbarProps = {
  progress: number;
  width?: number;
  height?: number;
  backgroundColor?: string;
  barColor?: string;
  borderRadius?: number;
};

function Progressbar({
  progress,
  width = 500,
  height = 10,
  backgroundColor = '#999',
  barColor = '#000',
  borderRadius = 10,
}: ProgressbarProps) {
  const containerStyle = useMemo(() => ({ width, height, backgroundColor, borderRadius, overflow: 'hidden' }), []); // eslint-disable-line react-hooks/exhaustive-deps
  const barStyle = useMemo(() => ({ height: '100%', backgroundColor: barColor, borderRadius }), []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={containerStyle}>
      <div style={{ width: `${progress}%`, ...barStyle }} />
    </div>
  );
}

export default memo(Progressbar);
