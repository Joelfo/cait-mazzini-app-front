import { produce } from "immer";
import { useState } from "react"
import { Option } from "react-bootstrap-typeahead/types/types"

export const useMazziniTypeAhead = <TEntity extends { id: number }, >() => {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const onChange = (selecteds: Option[]) => {
        const uniqueSelecteds = Array.from(new Set(selecteds));
        uniqueSelecteds.forEach(selected => {
            const selectedEntity = selected as TEntity;
            if (!selectedIds.includes(selectedEntity.id)) {
                setSelectedIds(produce(selectedIds, () => {
                    selectedIds.push(selectedEntity.id)
                }))
            }
        })
    }
}