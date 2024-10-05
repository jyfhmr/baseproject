import { Card, Checkbox, List, Select, Typography } from 'antd';
import React, { Dispatch, SetStateAction } from 'react';

interface Module {
    name: string;
    active: boolean;
    pages: Page[];
}

interface Page {
    name: string;
    active: boolean;
    packageId?: string;
    packages: { name: string; id: string }[];
    pages: Page[];
}

interface Application {
    name: string;
    active: boolean;
    modules: Module[];
}

interface CheckBoxProfileProps {
    optionsApplications: Application[];
    type: number;
    setOptionsApplications: Dispatch<SetStateAction<Application[]>>;
}

const CheckBoxProfile = ({ optionsApplications = [], type, setOptionsApplications }: any) => {
    const onChange = (indexApp: number) => {
        const applicationStateNew = [...optionsApplications];
        applicationStateNew[indexApp].active = !applicationStateNew[indexApp].active;
        setOptionsApplications(applicationStateNew);
    };

    const onModuleChange = (indexApp: number, indexMod: number) => {
        const applicationStateNew = [...optionsApplications];
        if (applicationStateNew[indexApp].modules) {
            applicationStateNew[indexApp].modules[indexMod].active =
                !applicationStateNew[indexApp].modules[indexMod].active;
        }
        setOptionsApplications(applicationStateNew);
    };

    const onPageChange = (indexApp: number, indexMod: number, indexPage: number) => {
        const applicationStateNew = [...optionsApplications];
        if (
            applicationStateNew[indexApp].modules &&
            applicationStateNew[indexApp].modules[indexMod].pages
        ) {
            applicationStateNew[indexApp].modules[indexMod].pages[indexPage].active =
                !applicationStateNew[indexApp].modules[indexMod].pages[indexPage].active;

            if (applicationStateNew[indexApp].modules[indexMod].pages[indexPage].pages.length > 0) {
                applicationStateNew[indexApp].modules[indexMod].pages[indexPage].pages.map(
                    (el: any, index: number) => {
                        applicationStateNew[indexApp].modules[indexMod].pages[indexPage].pages[
                            index
                        ].active =
                            applicationStateNew[indexApp].modules[indexMod].pages[indexPage].active;
                    },
                );
            }
        }
        setOptionsApplications(applicationStateNew);
    };

    const onPagePatherChange = (
        indexApp: number,
        indexMod: number,
        indexPage: number,
        indexPagePhater: number,
    ) => {
        const applicationStateNew = [...optionsApplications];
        if (
            applicationStateNew[indexApp].modules &&
            applicationStateNew[indexApp].modules[indexMod].pages &&
            applicationStateNew[indexApp].modules[indexMod].pages[indexPagePhater]
        ) {
            applicationStateNew[indexApp].modules[indexMod].pages[indexPage].pages[
                indexPagePhater
            ].active =
                !applicationStateNew[indexApp].modules[indexMod].pages[indexPage].pages[
                    indexPagePhater
                ].active;
        }
        setOptionsApplications(applicationStateNew);
    };

    const onSelectChange = (
        value: string,
        indexApp: number,
        indexMod: number,
        indexPage: number,
        indexPagePather: number,
    ) => {
        const applicationStateNew = [...optionsApplications];

        applicationStateNew[indexApp].modules[indexMod].pages[indexPage].pages[
            indexPagePather
        ].packageId = value;

        setOptionsApplications(applicationStateNew);
    };

    const getSelectValue = (
        indexApp: number,
        indexMod: number,
        indexPage: number,
        indexPagePather: number,
    ) => {
        return (
            optionsApplications[indexApp]?.modules?.[indexMod]?.pages?.[indexPage]?.pages[
                indexPagePather
            ].packageId || undefined
        );
    };

    const onSelectChangePather = (
        value: string,
        indexApp: number,
        indexMod: number,
        indexPage: number,
    ) => {
        const applicationStateNew = [...optionsApplications];
        applicationStateNew[indexApp].modules[indexMod].pages[indexPage].packageId = value;
        setOptionsApplications(applicationStateNew);
    };

    const getSelectValuePather = (indexApp: number, indexMod: number, indexPage: number) => {
        return (
            optionsApplications[indexApp]?.modules?.[indexMod]?.pages?.[indexPage]?.packageId ||
            undefined
        );
    };

    return (
        <div>
            {type === 1 &&
                optionsApplications.map((el: any, indexApp: number) => (
                    <Checkbox
                        onChange={() => onChange(indexApp)}
                        key={indexApp}
                        checked={el.active}
                    >
                        {el.name || 'Checkbox'}
                    </Checkbox>
                ))}

            {type === 2 &&
                optionsApplications.map(
                    (el: any, indexApp: number) =>
                        el.active &&
                        el.modules && (
                            <Card type="inner" title={el.name} key={indexApp}>
                                {el.modules.map((mod: any, indexMod: number) => (
                                    <Checkbox
                                        onChange={() => onModuleChange(indexApp, indexMod)}
                                        key={`${indexApp}-${indexMod}`}
                                        checked={mod.active}
                                    >
                                        {mod.name || 'Checkbox'}
                                    </Checkbox>
                                ))}
                            </Card>
                        ),
                )}

            {type === 3 &&
                optionsApplications.map(
                    (el: any, indexApp: number) =>
                        el.active &&
                        el.modules &&
                        el.modules.map(
                            (mod: any, indexMod: number) =>
                                mod.active &&
                                mod.pages && (
                                    <Card
                                        type="inner"
                                        title={`${el.name} - ${mod.name}`}
                                        key={`${indexApp}-${indexMod}`}
                                    >
                                        {mod.pages.map((pag: any, indexPage: number) => (
                                            <div key={`${indexApp}-${indexMod}-${indexPage}`}>
                                                {pag.pages.length > 0 ? (
                                                    <List
                                                        header={
                                                            <Checkbox
                                                                key={`${indexApp}-${indexMod}-${indexPage}-page`}
                                                                onChange={() =>
                                                                    onPageChange(
                                                                        indexApp,
                                                                        indexMod,
                                                                        indexPage,
                                                                    )
                                                                }
                                                                checked={pag.active}
                                                            >
                                                                {pag.name || 'Checkbox'}
                                                            </Checkbox>
                                                        }
                                                        bordered
                                                        dataSource={pag.pages}
                                                        renderItem={(
                                                            item: any,
                                                            indexPagePhater: number,
                                                        ) => (
                                                            <List.Item>
                                                                <Checkbox
                                                                    key={`${indexApp}-${indexMod}-${indexPage}-${indexPagePhater}-page`}
                                                                    onChange={() =>
                                                                        onPagePatherChange(
                                                                            indexApp,
                                                                            indexMod,
                                                                            indexPage,
                                                                            indexPagePhater,
                                                                        )
                                                                    }
                                                                    checked={item.active}
                                                                >
                                                                    {item.name || 'Checkbox'}
                                                                </Checkbox>
                                                            </List.Item>
                                                        )}
                                                    />
                                                ) : (
                                                    <Checkbox
                                                        onChange={() =>
                                                            onPageChange(
                                                                indexApp,
                                                                indexMod,
                                                                indexPage,
                                                            )
                                                        }
                                                        checked={pag.active}
                                                    >
                                                        {pag.name || 'Checkbox'}
                                                    </Checkbox>
                                                )}
                                            </div>
                                        ))}
                                    </Card>
                                ),
                        ),
                )}

            {type === 4 &&
                optionsApplications.map(
                    (el: any, indexApp: number) =>
                        el.active &&
                        el.modules &&
                        el.modules.map(
                            (mod: any, indexMod: number) =>
                                mod.active &&
                                mod.pages && (
                                    <Card
                                        type="inner"
                                        title={`${el.name} - ${mod.name}`}
                                        key={`mod-card-${indexApp}-${indexMod}`}
                                    >
                                        {mod.pages.map((pag: any, indexPage: number) => (
                                            <div key={`page-${indexApp}-${indexMod}-${indexPage}`}>
                                                {pag.active && (
                                                    <>
                                                        {pag.pages.length > 0 ? (
                                                            <List
                                                                header={
                                                                    <>
                                                                        <label htmlFor="">
                                                                            Paquete para :{' '}
                                                                            {pag.name}
                                                                        </label>
                                                                        <Select
                                                                            allowClear
                                                                            style={{
                                                                                width: '100%',
                                                                            }}
                                                                            placeholder="Seleccione"
                                                                            options={pag.packages}
                                                                            fieldNames={{
                                                                                label: 'name',
                                                                                value: 'id',
                                                                            }}
                                                                            value={getSelectValuePather(
                                                                                indexApp,
                                                                                indexMod,
                                                                                indexPage,
                                                                            )}
                                                                            onChange={(value) =>
                                                                                onSelectChangePather(
                                                                                    value,
                                                                                    indexApp,
                                                                                    indexMod,
                                                                                    indexPage,
                                                                                )
                                                                            }
                                                                        />
                                                                    </>
                                                                }
                                                                bordered
                                                                dataSource={pag.pages.filter(
                                                                    (el: any) => el.active,
                                                                )}
                                                                renderItem={(
                                                                    item: any,
                                                                    indexPagePhater: number,
                                                                ) => (
                                                                    <List.Item
                                                                        key={`list-item-${indexApp}-${indexMod}-${indexPage}-${indexPagePhater}`}
                                                                    >
                                                                        <label htmlFor="">
                                                                            Paquete para :{' '}
                                                                            {item.name}
                                                                        </label>
                                                                        <Select
                                                                            allowClear
                                                                            style={{
                                                                                width: '100%',
                                                                            }}
                                                                            placeholder="Seleccione"
                                                                            options={item.packages}
                                                                            fieldNames={{
                                                                                label: 'name',
                                                                                value: 'id',
                                                                            }}
                                                                            value={getSelectValue(
                                                                                indexApp,
                                                                                indexMod,
                                                                                indexPage,
                                                                                indexPagePhater,
                                                                            )}
                                                                            onChange={(value) =>
                                                                                onSelectChange(
                                                                                    value,
                                                                                    indexApp,
                                                                                    indexMod,
                                                                                    indexPage,
                                                                                    indexPagePhater,
                                                                                )
                                                                            }
                                                                        />
                                                                    </List.Item>
                                                                )}
                                                            />
                                                        ) : (
                                                            <>
                                                                <label htmlFor="">
                                                                    Paquete para : {pag.name}
                                                                </label>
                                                                <Select
                                                                    allowClear
                                                                    style={{ width: '100%' }}
                                                                    placeholder="Seleccione"
                                                                    options={pag.packages}
                                                                    fieldNames={{
                                                                        label: 'name',
                                                                        value: 'id',
                                                                    }}
                                                                    value={getSelectValuePather(
                                                                        indexApp,
                                                                        indexMod,
                                                                        indexPage,
                                                                    )}
                                                                    onChange={(value) =>
                                                                        onSelectChangePather(
                                                                            value,
                                                                            indexApp,
                                                                            indexMod,
                                                                            indexPage,
                                                                        )
                                                                    }
                                                                />
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </Card>
                                ),
                        ),
                )}

            {/* {type === 4 &&
                optionsApplications.map(
                    (el, indexApp) =>
                        el.active &&
                        el.modules &&
                        el.modules.map(
                            (mod, indexMod) =>
                                mod.active &&
                                mod.pages && (
                                    <Card
                                        type="inner"
                                        title={`${el.name} - ${mod.name}`}
                                        key={`${indexApp}-${indexMod}`}
                                    >
                                        {mod.pages.map(
                                            (pag, indexPage) =>
                                                pag.active && (
                                                    <div
                                                        key={`${indexApp}-${indexMod}-${indexPage}`}
                                                    ></div>
                                                ),
                                        )}
                                    </Card>
                                ),
                        ),
                )} */}
        </div>
    );
};

export default CheckBoxProfile;
