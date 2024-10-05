'use client';
import useProfile from '@/hooks/useProfile';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Row, Flex } from 'antd';
import { useRouter } from 'next/navigation';

type Props = {
    module: string;
    description: string;
};

const ButtonForm = ({ module, description }: Props) => {
    const router = useRouter();
    const { actions } = useProfile() as any;

    return (
        actions.includes(2) && (
            <Row>
                <Col span={12} md={6}>
                    <Flex gap="small">
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            style={{ marginBottom: 16 }}
                            onClick={() => router.push(`${module}/form`)}
                        >
                            <b>{description}</b>
                        </Button>
                    </Flex>
                </Col>
            </Row>
        )
    );
};

export default ButtonForm;
