import { useState } from "react"
import { Typeahead } from "react-bootstrap-typeahead"
import { Option } from "react-bootstrap-typeahead/types/types";

export const MazziniTypeahead = <TEntity extends { id: number }, >({isMultiple = false, onSelect, onRemove, options, labelProperty } : MazziniTypeaheadProps<TEntity>) => {
    const [ selectedEntities, setSelectedEntities ] = useState<TEntity[]>([]);

    const handleChange = (selecteds: Option[]) => {

        const newEntities = selecteds.filter(selected => !options.find(option => option.id == (selected as TEntity).id));
        const uniqueSelecteds = Array.from(new Set(selectedEntities));
        setSelectedEntities(uniqueSelecteds);
    } 

    return (
        <Typeahead
            allowNew
            multiple={isMultiple}
            selected={selectedEntities}
            options={options}
            labelKey={labelProperty}
            onChange={handleChange}
        />
    )
}

export type MazziniTypeaheadProps<TEntity> = {
    isMultiple?: boolean,
    onSelectNew: () => void,
    options: TEntity[],
    labelProperty: string,
}