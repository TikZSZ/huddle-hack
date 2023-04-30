
    export function getEnumValues<T>(enumType: T): Array<string> {
      return [
        ...new Set(
          Object.entries(enumType as any)
            .filter(([key]) => !~~key)
            .flatMap((item) => item),
        ),
      ] as any
    }
  
