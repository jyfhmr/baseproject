'use client';

import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Row } from 'antd';
import { useRouter } from 'next/navigation';

const ButtonBack = () => {
    
    const router = useRouter();

    return (
        <Row>
            <Col span={24}>
                <Flex justify={'flex-end'}>
                    <Button
                        type="primary"
                        icon={<ArrowLeftOutlined />}
                        shape="round"
                        onClick={ ()=>{router.back()}}
                    >
                        Regresar
                    </Button>
                </Flex>
            </Col>
        </Row>
    );
};

export default ButtonBack;
