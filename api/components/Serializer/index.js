class Serializer {
  serialize(data) {
    data = this.filter(data);
    return data;
  }

  filterObject(object) {
    const filteredData = {};
    this.publicKeys.forEach((key) => {
      filteredData[key] = object[key];
    });
    return filteredData;
  }

  filter(data) {
    if (Array.isArray(data))
      data = data.map((datum) => this.filterObject(datum));
    else data = this.filterObject(data);
    return data;
  }
}

class SerializerTasks extends Serializer {
  constructor(contentType) {
    super();
    this.contentType = contentType;
    this.publicKeys = ['id', 'text'];
    this.tagPlural = 'Tasks';
    this.tagSingular = 'Task';
  }
}

module.exports = {
  Serializer,
  SerializerTasks,
  acceptedTypes: ['application/json'],
};
