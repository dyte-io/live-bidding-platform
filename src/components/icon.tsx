/* eslint-disable react-hooks/exhaustive-deps */
import iconPack from '../icons.json'
import { useEffect, useState } from 'react';

interface Props {
    icon: keyof typeof iconPack;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    onClick?: (...args: any) => void;
}

const Icon = (props: Props) => {
  const { icon, className, onClick, size } = props;
  const [imgSrc, setImgSrc] = useState<string>('');

  useEffect(() => {
    const cont = document.getElementById('icon-cont');
    if (!cont) return;
    const color = window.getComputedStyle(cont).color;
    setImgSrc(`data:image/svg+xml;utf8,${encodeURIComponent(iconPack[icon].replaceAll('currentColor', color))}`)
  }, [icon]);

  return (
    <div id='icon-cont' onClick={onClick} className={`flex items-center justify-center h-full w-full outline-none text-inherit ${className}`}>
      <img className={`flex items-center bg-none img-${size}`} src={imgSrc} />
    </div>
  )
}

export default Icon

Icon.defaultProps = {
  className: '',
  size: 'md',
  onClick: () => {},
}