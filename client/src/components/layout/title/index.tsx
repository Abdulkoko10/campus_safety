import React from "react";
import { useRouterContext, TitleProps } from 
"@pankod/refine-core";
import { logo, alhikmah } from 'assets';
import { Button } from "@pankod/refine-mui";

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
  const { Link } = useRouterContext();

  return (
    <Button fullWidth variant="text" disableRipple>
      <Link to="/" style={{ display: 'inline-block', width: collapsed ? '35px' : '100px' }}>
        {collapsed ? (
          <img src={logo} alt="Campus Safety" style={{ width: '100%', height: 'auto' }} />
        ) : (
          <img src={alhikmah} alt="Refine" style={{ width: '100px', height: 'auto' }} />
        )}
      </Link>
    </Button>
  );
};
